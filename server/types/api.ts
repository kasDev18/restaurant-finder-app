export type OpenAIProps<T = string> = {
  OPENAI_APP_BASE_URI: T;
  OPENAI_API_KEY: T;
  OPENAI_APP_MODEL: T;
};

export interface OpenAIResponseProps<T = string> {
  choices: {
    message: {
      content: T;
    };
  }[];
}

export type FSAPIProps<T = string> = {
    FS_URI: T;
    FS_API_KEY: T;
}
