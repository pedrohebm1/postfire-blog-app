export async function authFetch(token: any) {
  let user = null;

  if (token) {
    try {
      const response = await fetch(
        "https://postfire.vercel.app/api/auth/authenticate",
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const authData = await response.json();
        return authData.user;
      } else {
        console.error(
          "Authentication failed:",
          response.status,
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching authentication:", error);
    }
  }
}
