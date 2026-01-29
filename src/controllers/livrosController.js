import NaoEncontrado from "../erros/NaoEncontrado.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import { autores, livros } from "../models/index.js";
//book

class LivroController {
  static listarLivros = async (req, res, next) => {
    try {
      let { limite = 5, pagina = 1 } = req.query;

      limite = parseInt(limite);
      pagina = parseInt(pagina);

      if (limite > 0 && pagina > 0) {
        const livrosResultado = await livros
        .find()
        .skip((pagina - 1) * limite)
        .limit(limite)
        .populate("autor")
        .exec();
  
        res.status(200).json(livrosResultado);
      } else {
        next(new RequisicaoIncorreta());
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros
        .findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultados !== null) {
        res.status(200).send(livroResultados);
      } else {
        next(new NaoEncontrado("Id do Livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroAtualizado = await livros.findByIdAndUpdate(id, {
        $set: req.body,
      });

      if (livroAtualizado !== null) {
        res.status(200).send({ message: "Livro atualizado com sucesso" });
      } else {
        next(new NaoEncontrado("Id do Livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroExcluido = await livros.findByIdAndDelete(id);

      if (livroExcluido !== null) {
        res.status(200).send({ message: "Livro removido com sucesso" });
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const buscar = await processaBusca(req.query);

      if (buscar !== null) {
        const livrosResultado = await livros
        .find(buscar)
        .populate("autor");

        res.status(200).send(livrosResultado);
      } else {
        res.status(200).send([]);
      }
    } catch (erro) {
      next(erro);
    }
  };
}

async function processaBusca(parametros) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

  let buscar = {};

  if (editora) buscar.editora = editora;
  if (titulo) buscar.titulo = { $regex: titulo, $options: "i" };

  if (minPaginas || maxPaginas) buscar.numeroPaginas = {};

  // gte = greater than or equal = Maior ou igual que
  if (minPaginas) buscar.numeroPaginas.$gte = minPaginas;
  // lte = less than or equal = Menor ou igual que
  if (maxPaginas) buscar.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

    if (autor !== null) {
      buscar.autor = autor._id;
    } else {
      buscar = null;
    }
  }

  return buscar;
}

export default LivroController;
