import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/analyze-profile(.*)",
  "/api/generate-plan(.*)",
  "/api/optimize-profile(.*)",
  "/api/chat(.*)",
  "/api/earnings-simulation(.*)",
  "/api/stripe/checkout(.*)",
  "/api/stripe/portal(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
