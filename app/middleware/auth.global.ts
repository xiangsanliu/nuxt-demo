export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth()
  const sessionCookie = useCookie('auth_session')
  
  // 1. 如果有 session cookie 但没有 user 状态，尝试获取用户信息
  // 这在 SSR 阶段非常重要
  if (sessionCookie.value && !user.value) {
    await fetchUser()
  }

  const publicRoutes = ['/login', '/register']
  
  // 2. 如果已登录且在访问登录/注册页，跳转到首页
  if (user.value && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }

  // 3. 如果未登录且不在公共页面，跳转到登录页
  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})