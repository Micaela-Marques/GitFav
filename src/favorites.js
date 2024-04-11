

// classe que vai conter a logica dos dados
import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase());
      const el = this.root.querySelector('#input-search')

      if (userExists) {
        el.value = ""
        throw new Error('Usuário já cadastrado');
      };

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!');
      }


      el.value = ""
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }



  delete(user) {
    const filteredEntries = this.entries.filter((entry) => entry.login !== user.login)

    this.entries = filteredEntries;
    this.update();
    this.save();
  }

}

//clase que vai criar a visualição e eventos HTML

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector('table tbody');

    this.update();
    this.onadd();

  }

  onadd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value);

    }
  }

  update() {

    this.removeAllTr();


    // Função que verifica se a tabela esta vazia


    const emptyDiv = document.querySelector('.empty');
    const tableBody = document.querySelector('table');

    if (this.entries.length > 0) {
      emptyDiv.classList.add('hide');
    } else {
      emptyDiv.classList.remove('hide');
    }



    this.entries.forEach(user => {
      const row = this.createRow();

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?');

        if (isOk) {
          this.delete(user);

        }
      }



      this.tbody.append(row);


    })


  }


  //criar elemento pela DOM

  createRow() {

    const tr = document.createElement('tr')

    tr.innerHTML = ` 
                        <td class="user">
                            <img src="https://github.com/maykbrito.png" alt="">
                            <a href="https://github.com/maykbrito.com" target="_blank">
                            <p>Mayk brito</p>
                            <span>maykbrito</span>
                        </td>
                        <td class="repositories"> 76
        
                        </td>
                        <td class="followers">
                            9589
                        <td>
                            <button class="remove">Remover</button>
                        </td>
                    
                    
        `
    return tr

  }
  // Defina o método removeAllTr() dentro da classe FavoritesView

  removeAllTr() {


    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      });
  }
}


