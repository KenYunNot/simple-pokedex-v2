import axios from 'axios';

import db from '../db/conn.mjs';


async function getVarietiesAsSubdocuments(varieties) {
  let newVarieties = [];
  for (let variety of varieties) {
    let { data: pokemonData } = await axios.get(variety.pokemon.url);
    delete pokemonData['species'];
    newVarieties.push({
      is_default: variety.is_default,
      pokemon: pokemonData,
    });
  }
  return newVarieties;
}

function getEnglishFlavorTextEntries(entries) {
  let englishEntries = [];
  for (let entry of entries) {
    if (entry.language.name === 'en') {
      englishEntries.push({
        flavor_text: entry.flavor_text,
        version: entry.version,
      })
    }
  }
  return englishEntries;
}

function getEnglishGenus(genera) {
  for (let genus of genera) {
    if (genus.language.name === 'en')
      return genus.genus;
  }
}

async function seedDatabase() {
  try {
    let collection = db.collection('species');
    let { data: speciesPageData } = await axios.get('https://pokeapi.co/api/v2/pokemon-species');
    // const NUM_POKEMON_SPECIES = speciesPageData.count;
    const NUM_POKEMON_SPECIES = 2;
    for (let i = 1; i <= NUM_POKEMON_SPECIES; i++) {
      let { data: speciesData } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
      speciesData.flavor_text_entries = getEnglishFlavorTextEntries(speciesData.flavor_text_entries);
      speciesData.genus = getEnglishGenus(speciesData.genera);
      speciesData.varieties = await getVarietiesAsSubdocuments(speciesData.varieties);
      delete speciesData.genera;
      collection.insertOne(speciesData);
    }
  } catch(e) {
    console.error(e);
  }
}

async function clearDatabase() {
  try {
    let collection = db.collection('species');
    collection.deleteMany();
  } catch(e) {
    console.error(e); 
  }
}

// clearDatabase().then(() => console.log("Cleared database"));
seedDatabase().then(() => console.log("Seeded database"));