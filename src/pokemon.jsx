import { useEffect, useState } from "react";
import './App.css'

export const ApiProject = () => {
    const [pokemons, setPokemons] = useState([]);
    const [search, setSearch] = useState('');

    const API = 'https://pokeapi.co/api/v2/pokemon?limit=100';

    const fetching = async () => {

        try {
            const res = await fetch(API);
            const data = await res.json();

            const pokemon = await data.results.map( async(curr) => {
                const response = await fetch(curr.url);
                const data = await response.json();
                return data;
            });

            const responses = await Promise.all(pokemon);
            setPokemons(responses);
        } catch (error) {
            console.log("the error is : ", error);
        }
    }
    

    useEffect(() => {
        fetching();
    }, [])

    useEffect(() => {
        console.log(pokemons);
    }, [pokemons]);

    const filtered = pokemons.filter(curr => curr.name.toLowerCase().includes(search.toLowerCase()));
    return (<>
        {pokemons ? (<div>
            <section>
                <h1 className="heading">THE POKEMONS</h1>   
                <div className="inputDiv">
                    <input type="text" placeholder="search pokemons" value={search} 
                    onChange={(e) => setSearch(e.target.value)}/>
                </div>
            </section>
            <section className="outer-box">
                <ul>
                    {filtered.map((curr) => {
                        return (
                            <div className="card" key={curr.id}>
                                <div className="anime"><img src={curr.sprites.other.dream_world.front_default} alt={curr.name}/></div>
                                <h1>{curr.name}</h1>
                                <div className="powers">
                                    {curr.types.map((curr) => {
                                        return `${curr.type.name}, `
                                    })}
                                </div>
                                <div className="attribs">
                                    <p><span>height : </span>{curr.height} </p>
                                    <p><span>weight : </span>{curr.weight}</p>
                                    <p><span>speed : </span>{curr.stats[5].base_stat}</p>
                                    <p><span>experience : </span>{curr.base_experience}</p>
                                    <p><span>attack : </span>{curr.stats[1].base_stat}</p>
                                    <p><span>ability : </span>{curr.abilities.map(curr =>  `${(curr.ability.name).slice(0, 3)}, `)}</p>
                                </div>
                            </div>
                        )
                    })}
                </ul>
            </section>
        </div>) : (
            <>
                <h1>loading...</h1>
            </>
        )}
    </>)
}