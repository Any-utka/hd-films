declare module 'expo-sqlite' {
  export interface SQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      success?: (tx: SQLTransaction, resultSet: SQLResultSet) => void,
      error?: (tx: SQLTransaction, error: SQLError) => boolean
    ): void;
  }

  export interface SQLResultSet {
    insertId: number;
    rowsAffected: number;
    rows: {
      length: number;
      item(index: number): any;
      _array: any[];
    };
  }

  export interface SQLError {
    code: number;
    message: string;
  }

  export interface Database {
    transaction(
      callback: (tx: SQLTransaction) => void,
      error?: (error: SQLError) => void,
      success?: () => void
    ): void;
  }

  export function openDatabase(
    name: string,
    version?: string,
    description?: string,
    size?: number
  ): Database;
}
