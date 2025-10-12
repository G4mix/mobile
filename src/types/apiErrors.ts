// Tipos de erro específicos da API
export type ApiErrorCode =
  // Autenticação
  | "INVALID_TOKEN"
  | "INVALID_EMAIL_OR_PASSWORD"
  | "TOKEN_NOT_FOUND"
  | "UNAUTHORIZED"
  | "EMAIL_NOT_VERIFIED"
  | "EXCESSIVE_LOGIN_ATTEMPTS"
  // Validação de dados
  | "INVALID_NAME"
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD"
  | "INVALID_CONTENT"
  | "INVALID_TITLE"
  | "INVALID_IMAGE_FORMAT"
  | "EXCEEDED_MAX_SIZE"
  // Ideias
  | "COMPLETELY_EMPTY_POST"
  | "TOO_MANY_LINKS"
  | "TOO_MANY_TAGS"
  | "TOO_MANY_IMAGES"
  | "YOU_ARE_NOT_THE_AUTHOR"
  | "IDEA_NOT_FOUND"
  | "IDEA_ALREADY_LIKED"
  | "IDEA_NOT_LIKED"
  // Comentários
  | "COMMENT_NOT_FOUND"
  | "COMMENT_ALREADY_LIKED"
  | "COMMENT_NOT_LIKED"
  // Usuários
  | "USER_NOT_FOUND"
  | "USER_ALREADY_EXISTS"
  | "CANNOT_FOLLOW_SELF"
  | "ALREADY_FOLLOWING"
  | "NOT_FOLLOWING"
  // Upload de arquivos
  | "PICTURE_UPDATE_FAIL"
  // Provedores
  | "PROVIDER_NOT_FOUND"
  // Email
  | "ERROR_WHILE_CHECKING_EMAIL"
  | "ERROR_WHILE_SENDING_EMAIL"
  // Dados gerais
  | "NOT_FOUNDED_DATA"
  // Códigos de status HTTP
  | "BAD_REQUEST"
  | "FORBIDDEN"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE";

// Interface para resposta de erro da API
export interface ApiErrorResponse {
  message: ApiErrorCode;
  statusCode: number;
  timestamp: string;
  path: string;
}

// Interface para erro customizado
export interface CustomError {
  code: ApiErrorCode;
  message: string;
  statusCode?: number;
}
