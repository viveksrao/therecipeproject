const React = require('react');
const _ = require('lodash');
const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;

const model = new falcor.Model({
  cache:{
    ingredientsById:{
      1:{
        name:"Mixed Vegetables",
        description:"250 gm mixed cooked vegetables"
      },
      2:{
        name:"Methi",
        description:"1 bunch methi, chopped"
      }
    },
    recipes:[
      {
        name:"Bhaji Par Eeda",
        instructions:"Soak the methi in some salt water to draw out the bitterness and leave for twenty minutes or more. In the meantime, heat the ghee in a saucepan and add onions, cooking until they turn a pale brown colour. Throw in everything but the eggs and the methi, stirring and cooking on low heat for five minutes. Then add the methi (having first squeezed the bitter juice out) evenly in the pan, cooking for a minute or so.  Make nests in the mixture and break the eggs over them. Season with salt and cover, cooking on low heat until eggs are set.",
        ingredients:[
          $ref("ingredientsById[1]"),
          $ref("ingredientsById[2]")
        ],
        authors:$atom(["Brian","John","Tina"])
      },
      {
        name:"Spanish Omelette",
        instructions:"Mix the vegetables and tomatoes together. Heat oil and Add chopped garlic and onion. Cover and cook over a gentle heat until soft but not colored. Stir in the vegetables and potatoes. Heat through. Beat the eggs, seasoning, paprika and herbs together. Pour into the pan. Cook until the eggs are coated underneath. Place pan under a hot grill to color the top of the omelette. Slide out flat onto a plate and serve immediately.",
        ingredients:[
          $ref("ingredientsById[1]")
        ],
        authors:$atom(["Jessica","Tammy"])
      }
    ]
  }
});

const App = React.createClass({
  render(){
    return(
      <div>
        <RecipeList/>
      </div>
    );
  }
});

const RecipeList = React.createClass({
  getInitialState(){
    return{
      recipes:[]
    };
  },
  componentWillMount(){
    model.get(
      ['recipes',{from: 0,to: 9}, Recipe.queries.recipe()],
      ['recipes',{from: 0, to: 9},'ingredients',{from: 0, to: 9},Ingredients.queries.ingredients()]
    )
    .then(data => {
      this.setState({
        recipes: _.values(data.json.recipes)
      });
      console.log(_.values(data.json.recipes));
    });
  },
  render(){
    return(
      <div>
        {this.state.recipes.map((recipe,index) => {
          return(
            <Recipe key={index} {...recipe} />
          );
        })}
      </div>
    )
  }
});
const Recipe = React.createClass({
  statics:{
    queries:{
      recipe(){
        return _.union(Name.queries.recipe(),Instructions.queries.recipe());
      },
      ingredients(){
        return Ingredients.queries.recipe();
      }
    }
  },
  render(){
    return(
      <div>
        <Name {..._.pick(this.props,Name.queries.recipe())}/>
        <Instructions {..._.pick(this.props,Instructions.queries.recipe())}/>
        <Ingredients ingredients={this.props.ingredients}/>
      </div>
    );
  }
});

const Name = React.createClass({
  statics:{
    queries:{
      recipe(){
        return ["name","authors"];
      }
    }
  },
  render(){
    return(
      <div>
        <h1>{this.props.name}</h1>
        <h1>{JSON.stringify(this.props.authors)}</h1>
      </div>
    );
  }
});

const Instructions = React.createClass({
  statics:{
    queries:{
      recipe(){
        return ["instructions"];
      }
    }
  },
  render(){
    return(
      <h1>{this.props.instructions}</h1>
    );
  }
});

const Ingredients = React.createClass({
  statics:{
    queries:{
      ingredients(){
        return ["name","description"];
      }
    }
  },
  render(){
    return(
      <h1>{JSON.stringify(this.props.ingredients)}</h1>
    );
  }
});


React.render(<App/>,window.document.getElementById('target'));
