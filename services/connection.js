const connection = new JsStore.Instance(new Worker('../assets/jsstore/dist/jsstore.worker.min.js'));
connection.setLogStatus(true);
export { connection };