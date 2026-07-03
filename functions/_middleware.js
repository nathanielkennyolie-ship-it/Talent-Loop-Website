export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const pageMap = [
    '/about', '/jobs', '/blog', '/assessment',
    '/contact', '/testimonials', '/legal', '/privacy',
  ];

  if (pageMap.includes(path)) {
    url.pathname = path + '.html';
    return next(new Request(url.toString(), request));
  }

  if (path.startsWith('/blog/') && !path.endsWith('.html')) {
    url.pathname = path + '.html';
    return next(new Request(url.toString(), request));
  }

  return next();
}
