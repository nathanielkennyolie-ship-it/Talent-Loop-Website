export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const pageMap = {
    '/about': '/about.html',
    '/jobs': '/jobs.html',
    '/blog': '/blog.html',
    '/assessment': '/assessment.html',
    '/contact': '/contact.html',
    '/testimonials': '/testimonials.html',
    '/legal': '/legal.html',
    '/privacy': '/privacy.html',
  };

  if (pageMap[path]) {
    return env.ASSETS.fetch(new URL(pageMap[path], url));
  }

  if (path.startsWith('/blog/') && !path.endsWith('.html')) {
    const assetUrl = new URL(path + '.html', url);
    const resp = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (resp.status !== 404) return resp;
  }

  return next();
}
