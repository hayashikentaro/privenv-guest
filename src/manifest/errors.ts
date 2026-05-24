export class ManifestLoadError extends Error {
  readonly code = "manifest.load_error";
}

export class ManifestValidationError extends Error {
  readonly code = "manifest.validation_error";
}
