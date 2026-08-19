import '@eslint/core';

declare module '@eslint/core' {
  /** Legacy `meta.docs.category`, still carried by every rule in this plugin. */
  interface RulesMetaDocs {
    category?: string | undefined;
  }

  interface SettingsConfig {
    inferno?: {
      pragma?: string;
      fragment?: string;
      createClass?: string;
    };
  }
}

export {};
