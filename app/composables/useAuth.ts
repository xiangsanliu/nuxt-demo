export const useAuth = () => {
  const user = useState<any>('auth_user', () => null);

  const fetchUser = async () => {
    try {
      // 使用 useRequestFetch 确保在 SSR 期间自动转发 Cookie
      const client = useRequestFetch()
      const data = await client('/api/auth/me');
      user.value = data.user;
    } catch (err) {
      user.value = null;
    }
  };

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' });
    user.value = null;
    navigateTo('/login');
  };

  return {
    user,
    fetchUser,
    logout
  };
};