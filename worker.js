export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") {
      const clientId = env.GITHUB_CLIENT_ID;
      const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
      return Response.redirect(redirectUri, 302);
    }

    if (url.pathname === "/api/callback") {
      const code = url.searchParams.get("code");
      const clientId = env.GITHUB_CLIENT_ID;
      const clientSecret = env.GITHUB_CLIENT_SECRET;

      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify(data), { status: 400 });
      }

      const token = data.access_token;
      const content = `
        <script>
          const receiveMessage = (message) => {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token, provider: "github" })}',
              message.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        </script>
      `;

      return new Response(content, { headers: { "content-type": "text/html;charset=UTF-8" } });
    }

    return env.ASSETS.fetch(request);
  },
};
