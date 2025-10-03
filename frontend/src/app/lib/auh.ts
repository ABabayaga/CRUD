export function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token"); 
      document.cookie = "access_token=; Max-Age=0; path=/";
    }
  }