import path from "path";
import { parseDocs } from "./parseDocs/docParser";

const workingDir = path.normalize(path.join(__dirname, '..', 'data'));
const inputPath = path.join(workingDir, 'Docs.json');
parseDocs(inputPath, workingDir);