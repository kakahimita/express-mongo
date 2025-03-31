// import http from "http";
import app from "./src/app.js";

const PORT = 3000;

const rotas = {
    "/": "Curso de Node.js",
    "/livros": "Entrei na rota livros",
    "/autores": "Entrei na rota autores"
};

app.listen(PORT, () => {
    console.log("servidor escutando!");
});
