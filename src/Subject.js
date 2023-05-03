class Subject {
  constructor() {
    this.observers = [];
  }
  subscribe(observer) {
    if (observer && !this.observers.includes(observer))
      this.observers.push(observer);
  }
  unsubscribe(observer) {
    this.observers = this.observers.filter((o) => o != observer);
  }
  unsubscribeAll() {
    this.observers = [];
  }

  notifySubscribers(source, ...others) {
    for (const observer of this.observers) observer.update(source, ...others);
  }
}

export { Subject };
