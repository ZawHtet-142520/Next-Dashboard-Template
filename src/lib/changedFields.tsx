type ChangedFields<T> = {
  [K in keyof T]?: T[K];
};

export function getChangedFields<T extends Record<PropertyKey, unknown>>(
  oldFields: Readonly<T>,
  newFields: Readonly<T>,
): ChangedFields<T> {
  return Object.fromEntries(
    Object.entries(newFields as Record<PropertyKey, unknown>).filter(
      ([key, newField]) => {
        // ✅ Type-safe without `any`
        const typedKey = key as keyof T;
        const oldField = oldFields[typedKey];
        return newField !== oldField;
      },
    ),
  ) as ChangedFields<T>;
}

export function hasChanges<T extends Record<PropertyKey, unknown>>(
  oldFields: Readonly<T>,
  newFields: Readonly<T>,
): boolean {
  return Object.keys(getChangedFields(oldFields, newFields)).length > 0;
}

export function getDirtyFieldsCount<T extends Record<PropertyKey, unknown>>(
  oldFields: Readonly<T>,
  newFields: Readonly<T>,
): number {
  return Object.keys(getChangedFields(oldFields, newFields)).length;
}
