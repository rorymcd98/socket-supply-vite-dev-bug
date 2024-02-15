import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import os from "socket:os";
import * as fs from "socket:fs";
import sqlWasmUrl from "./sql-wasm.wasm?url";
import initSqlJs, { Database } from "sql.js";
import Sbuffer from "socket:buffer";

function App() {
  const [count, setCount] = useState(0);
  const dbRef = useRef<Database>();

  useEffect(() => {
    let SQL: initSqlJs.SqlJsStatic;
    const fetchSql = async () => {
      SQL = await initSqlJs({
        locateFile: () => sqlWasmUrl,
      });
      const dbLocation = "./test.sqlite";
      await fs.readFile(
        dbLocation,
        {},
        (error: Error | null, data: Sbuffer | null) => {
          if (error) throw error;
          if (data === null) throw new Error();
          const bufferData = data as unknown as Buffer;

          const db = new SQL.Database(bufferData);
          dbRef.current = db;

          const sqlstr = `INSERT INTO hello VALUES (${Math.floor(
            Math.random() * 50
          )}, 'hello'); \
                INSERT INTO hello VALUES (${Math.floor(
                  Math.random() * 50
                )}, 'world');`;
          db.run(sqlstr); // Run the query without returning anything

          // Prepare an SQL statement
          const stmt = db.prepare("SELECT * FROM hello");

          // Bind values to the parameters and fetch the results of the query
          while (stmt.step()) {
            const result = stmt.getAsObject();
            console.log(result);
          }

          // Export the updated SQLite database to a binary array
          const exportBinaryArray = db.export();

          fs.writeFile(
            dbLocation,
            exportBinaryArray,
            {},
            (err: Error | null) => {
              if (err != null) console.log(err);
              return;
            }
          );
        }
      );
    };

    if (dbRef.current == null) {
      fetchSql().catch(console.error);
    }
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {os.platform()}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
