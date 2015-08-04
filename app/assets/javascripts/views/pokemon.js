Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');

    this.pokemon = new Pokedex.Collections.Pokemon();
    this.$pokeList.on("click", "li.poke-list-item", this.selectPokemonFromList.bind(this));
    this.$newPoke.on("submit", this.submitPokemonForm.bind(this));
    this.$pokeDetail.on("click", "li.toy-list-item", this.selectToyFromList.bind(this));
  },

  addPokemonToList: function (pokemon) {

    var name = pokemon.get('name');
    var type = pokemon.get('poke_type');
    $pokemon = ($("<li>"))
          .addClass("poke-list-item")
          .data("id", pokemon.id)
          .text("Name: " + name + ", Type: " + type);
    this.$pokeList.append($pokemon);
  },

  refreshPokemon: function () {
    var view = this;
    this.pokemon.fetch({
      success: function () {
        view.pokemon.each(function(el) {
          view.addPokemonToList.call(view, el);
        });
      }
    });
  },

  renderPokemonDetail: function(pokemon) {
    var view = this;
    var $detail = $("<div>").addClass("detail");
    var $img = $('<img src="' + pokemon.get('image_url') + '">');
    $detail.append($img);

    for(var attr in pokemon.attributes) {
      if(attr !== "image_url") {
        $detail.append(($("<p>").text(attr + ': ' + pokemon.get(attr))));
      }
    };
    this.$pokeDetail.html($detail);

    var $toysList = $('<ul>').addClass("toys");
    pokemon.fetch({
      success: function(model) {
        var toyList = model.toys();

        toyList.forEach(function(toy){
          view.addToyToList(toy);
        });
      }
    });
    this.$pokeDetail.append($toysList);
  },

  selectPokemonFromList: function(event) {
    var id = $(event.currentTarget).data("id");
    var pokemon = this.pokemon.get(id);
    this.renderPokemonDetail(pokemon);
  },

  createPokemon: function(attributes, callback) {
    var poke = new Pokedex.Models.Pokemon(attributes);
    var view = this;
    poke.save({}, {
      success: function() {
        view.pokemon.add(poke)
        view.addPokemonToList(poke);
        callback(poke);
      },
      error: function() {
        debugger;
      }
    });
  },

  submitPokemonForm: function(event) {
    event.preventDefault();
    var formContents = $(event.target).serializeJSON();
    this.createPokemon(formContents, this.renderPokemonDetail.bind(this));
  },

  addToyToList: function(toy) {
    var $toyItem = $("<li>")
      .addClass("toy-list-item")
      .data("toy-id", toy.id)
      .data("pokemon-id", toy.get("pokemon_id"))

      // debugger;
    for(var attr in toy.attributes) {
      if(attr !== "image_url") {
        $toyItem.append(attr + ': ' + toy.get(attr) + "\n");
      }
    };

    $("ul.toys").append($toyItem);
  },

  renderToyDetail: function(toy) {
    var $toyDiv = $("<div>").addClass('detail');
    var $img = $('<img src="' + toy.get('image_url') + '">');
    $toyDiv.append($img);

    this.$toyDetail.html($toyDiv)
  },

  selectToyFromList: function(event) {
    var $toyItem = $(event.currentTarget)
    var toyId = $toyItem.data("toy-id");
    var pokemonId = $toyItem.data("pokemon-id");
    var pokemon = this.pokemon.get(pokemonId);
    var toys = pokemon.toys();
    var toy = toys.get(toyId);

    this.renderToyDetail(toy);
  }

});
