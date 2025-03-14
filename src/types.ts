interface Environment {
  TrelloLists: KVNamespace; // Single group of lists per key? up to 25MB storage.
}

interface HandlerArgs {
  request: Request;
  env: Environment;
  ctx: ExecutionContext;
  route: URLPattern; // return type from URLPattern.exec()
}

export { Environment, HandlerArgs };
