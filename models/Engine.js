class Engine {
  constructor({
    id,
    model,
    type,
    description,
    isTurbo,
    createdAt,
    applications
  }) {
    this.id = id ?? Date.now();
    this.model = model;
    this.type = type;
    this.description = description;
    this.isTurbo = isTurbo;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.applications = applications ?? [];
  }

  static create(data) {
    return new Engine({
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
  }

  update(data) {
    this.model = data.model ?? this.model;
    this.type = data.type ?? this.type;
    this.description = data.description ?? this.description;
    this.isTurbo = data.isTurbo ?? this.isTurbo;
    this.applications = data.applications ?? this.applications;
  }

  patch(data) {
    Object.keys(data).forEach((key) => {
      if (key in this) {
        this[key] = data[key];
      }
    });

    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Engine;