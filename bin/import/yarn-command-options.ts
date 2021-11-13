export interface YarnCommandOptions {
  /** when called by a script, allows printUsage to print the correct command */
  readonly usageCommand: string;

  /** returns true if usage should be printed */
  readonly help: boolean;

  /** returns true if there are any errors */
  readonly hasErrors: boolean;
  
  /** prints errors to console.error, if there are any */
  printErrors(): void;

  /** prints usage help to console.log */
  printUsage(): void;
}
