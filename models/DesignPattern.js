class DesignPattern {
  constructor({
    id,
    name,
    category,
    description,
    isCreational,
    createdAt,
    examples
  }) {
    this.id = id ?? Date.now();
    this.name = name;
    this.category = category;
    this.description = description;
    this.isCreational = isCreational;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.examples = examples ?? [];
  }

  static create(data) {
    return new DesignPattern({
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
  }

  update(data) {
    this.name = data.name ?? this.name;
    this.category = data.category ?? this.category;
    this.description = data.description ?? this.description;
    this.isCreational = data.isCreational ?? this.isCreational;
    this.examples = data.examples ?? this.examples;
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

module.exports = DesignPattern;