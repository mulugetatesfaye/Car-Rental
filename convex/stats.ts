import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardSummary = query({
  args: {},
  handler: async (ctx) => {
    // Fetch last 1000 rides for statistics
    const rides = await ctx.db.query("rides").order("desc").take(1000);
    
    // Status counts
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
    
    let totalRevenue = 0;
    
    // Revenue tracking over time (simple implementation using first 10 chars of date "YYYY-MM-DD")
    const revenueByDate: Record<string, number> = {};
    const bookingsByDate: Record<string, number> = {};

    for (const ride of rides) {
      statusCounts[ride.status]++;
      
      const dateKey = new Date(ride.createdAt).toISOString().split('T')[0];
      
      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = 0;
      }
      bookingsByDate[dateKey]++;

      if (ride.status === "completed") {
        totalRevenue += ride.price;
        if (!revenueByDate[dateKey]) {
          revenueByDate[dateKey] = 0;
        }
        revenueByDate[dateKey] += ride.price;
      }
    }

    // Convert to arrays for charts
    const chartData = Object.keys(bookingsByDate).sort().slice(-14).map(date => ({
      date,
      revenue: revenueByDate[date] || 0,
      bookings: bookingsByDate[date],
    }));

    const recentRides = rides.slice(0, 5);
    
    // Fleet stats
    const carTypes = await ctx.db.query("carTypes").collect();
    const activeFleet = carTypes.filter(c => c.isActive).length;

    // Averages
    const avgRideValue = statusCounts.completed > 0 ? totalRevenue / statusCounts.completed : 0;
    const cancellationRate = rides.length > 0 ? (statusCounts.cancelled / rides.length) * 100 : 0;

    return {
      totalRevenue,
      statusCounts,
      avgRideValue,
      cancellationRate,
      activeFleet,
      recentRides,
      chartData,
      totalRecentBookings: rides.length,
    };
  },
});

export const getCustomerList = query({
  args: {},
  handler: async (ctx) => {
    const rides = await ctx.db.query("rides").order("desc").collect();
    
    const customersMap = new Map();
    
    for (const ride of rides) {
      if (!ride.customerEmail) continue;
      
      if (!customersMap.has(ride.customerEmail)) {
        customersMap.set(ride.customerEmail, {
          name: ride.customerName,
          email: ride.customerEmail,
          phone: ride.customerPhone,
          totalRides: 0,
          totalSpend: 0,
          lastRideDate: ride.createdAt,
        });
      }
      
      const cust = customersMap.get(ride.customerEmail);
      cust.totalRides++;
      if (ride.status === "completed") {
        cust.totalSpend += ride.price;
      }
    }
    
    return Array.from(customersMap.values());
  },
});
