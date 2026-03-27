import { convexAuthNextjsProxy, createRouteMatcher, isAuthenticatedNextjs, nextjsProxyRedirect } from "@convex-dev/auth/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isSignInRoute = createRouteMatcher(["/admin/login"]);

export default convexAuthNextjsProxy((request) => {
  // If user is trying to access admin pages (but not the login page itself)
  if (isAdminRoute(request) && !isSignInRoute(request)) {
    // If they aren't authenticated, redirect to the login page
    if (!isAuthenticatedNextjs()) {
      return nextjsProxyRedirect(request, "/admin/login");
    }
  }

  // If user is already authenticated and tries to access the login page, redirect to the admin dashboard
  if (isSignInRoute(request) && isAuthenticatedNextjs()) {
      return nextjsProxyRedirect(request, "/admin");
  }
});

export const config = {
  // The matcher dictates which routes this proxy function should run on.
  // We run it on things like /admin/* but skip internal next routes to save cycles.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
