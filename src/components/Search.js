
/*---------------------------------------------------------------------*/

//Pàgina que mostra la pel·lícula que estem buscant

import React from 'react';
import axios from 'axios';
import Loader from '../assets/loading.gif';
import PageNavigation from './PageNavigation.js';
import filmDefault from '../assets/filmDefault.jpg';
import searchIcon from '../assets/searchIcon.png';



class Search extends React.Component {
    
    constructor (props){
        super(props);

        // Inicialitzem les variables
        this.startState();

        this.getPopularFilms();

        this.cancel= '';

    }

    getPageCount = (total, denominator) => {
        const divisible = 0 === total % denominator;
        const valueToBeAdded = divisible ? 0: 1;
        return Math.floor(total/denominator) + valueToBeAdded;
    }

    
    fetchSearchResults = (updatedPageNum = '', query) =>{
        const pageNumber = updatedPageNum ? `&page=${updatedPageNum}` : '';
        
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=417f399abcc8fa6b50750d4fc444e2fe&language=en-US&query=${query}${pageNumber}`;

        if(this.cancel){
            this.cancel.cancel();
        }
        

        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {
            cancelToken: this.cancel.token
        })
            .then(resp=>{
                const total = resp.data.total_results;
                const totalPagesCounter = this.getPageCount(total,20);
                console.log(resp.data);
                const resultNotFound = ! resp.data.results.length ? 'There are no more results.' : '';
            
                this.setState({
                    results: resp.data.results,
                    message: resultNotFound,
                    totalResults: total,
                    totalPages: totalPagesCounter,
                    currentPageNum: updatedPageNum,
                    loading: false,
                    show: false,
                })
                
            })
            .catch(error=>{
                if(axios.isCancel(error) || error ){
                    this.setState({
                        loading: false,
                        message: ' ',
                    })
                }
            } )
    };



    handleOnInputChange = (event) => {
    const query = event.target.value;
        if(!query){
            
// Si no hi ha cap paraula que cercar reiniciem l'objecte, això farà que no es mostri cap resultat i després de fer el resetState tornem a conseguir la llista inicial de popular films 
            
            this.resetState();
            this.getPopularFilms();
        }else{
            this.setState({query:query, 
                           loading:true, 
                           message: '' },  ()=>{
                this.fetchSearchResults(1,query);
            } );
        }
    };

    handlePageClick = (type,) => {
        const updatedPageNum = 'prev' === type ? this.state.currentPageNum - 1 : this.state.currentPageNum + 1;
        if( ! this.state.loading ){
            this.setState({loading: true, 
                           message:'' }, () => {
                this.fetchSearchResults(updatedPageNum, this.state.query);
            });
        }
    };


    renderSearchResults = () => {
        const {results} = this.state;
        if (Object.keys(results).length && results.length){
            return(
                <div className="results-container">
                    { results.map( result=> {
                        const x = "https://image.tmdb.org/t/p/w185";
                        const alttext = "poster image";
                        return(
                            
                            <div key={result.id}className="result-item">
                <div className="pic-title">{result.title}</div>
                <div className="img-cont">
                                
                                
                
                                
                                {result.poster_path ? <img className="img" src={x+result.poster_path} alt={result.title+alttext}/> : <img className="img" src={filmDefault} />}
                                <p className="cuerpo">Rating:  {result.vote_average}<br></br><br></br>
                
                                <button class="moreinfo" onClick={()=>{this.changeShow(); this.getResults(result.id)}}>More info</button></p>
                                </div>
                            </div>
                        )
                    } )}
                </div>
            )
        }
    };

/*Si no es compleix la primera condició, és a dir, si la imatge té la url de poster_path s'ens mostra la imatge, però si no la té s'ens mostra una imatge que hem triat que posa "NO IMAGE"*/
    
    changeShow(){
        this.state.show = true;
    };

//Aqui obtenim els resultats del Search, és a dir, primer fem el getResults per prendre les dades de la api i quan ja les tenim ho mostrem a la funció showResults. Ho hem fet en dues funcions separades ja que sino ens donava errors. A vegades intentava mostrar els resultats sense haver aconseguit les dades.

    getResults(url){
        const neourl = `https://api.themoviedb.org/3/movie/${url}?api_key=417f399abcc8fa6b50750d4fc444e2fe&language=en-US`;

        axios.get(neourl).then(resp=>{
            console.log(resp.data);
            this.setState({
                results2: resp.data,
            })

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

        })
    };

    showResults(){
        const x = "https://image.tmdb.org/t/p/w780";
        const alttext = "poster image";

        return(
            <div itemID="objdet" className={`infowindow ${this.state.show ? 'show' : 'hide'}`}>
            
            <div class="box">
            <img className="detailimg" itemID="img" src={x+this.state.results2.poster_path} alt={this.state.results2.title+alttext}/>
            <div id="title">{this.state.results2.title}</div>
            
            <p></p>

            <div class="infoDetail">
            <div class="titleSynopsis"> Synopsis: </div>
            <p id="synop">{this.state.results2.overview}</p>
            <div class="titleScore"> Average Score: </div>
            <div><p id="score">{this.state.results2.vote_average}</p></div>
            <div class="titleDate"> Release date: </div>
            <p id="release">{this.state.results2.release_date}</p>

            <div class="buttonHide">
<button className="button" onClick={()=>{
                this.setState({show:false})
            }}>Hide info</button>
</div>
</div>
            </div>

            </div>
            
        )
    };

    render(){

        const { query, loading, message, currentPageNum, totalPages } = this.state;
        const showPrevLink = 1 < currentPageNum;
        const showNextLink = totalPages > currentPageNum;
        

        return(
            
            <div className="container">
                /*heading*/
                <div className="heading">
                    <div class="title">HBO</div>
                <label className="search-label" htmlFor="search-input">
                    <input 
                        type="text"
                        name="query"
                        value={query}
                        id="search-input"
                        placeholder="Search..."
                        onChange={this.handleOnInputChange}
                    />
                    
                </label>
<i className="fas fa-search searchIcon"/>
</div>
                

                {/*error message*/}
                {message && <p className="err-message">{message}</p>}

//El que fem aqui es que si la query té més d'un caràcter s'ens mostra el missatge de "Showing results for..." i la paraula que estem cercant

                {/*search message*/}
                {this.state.query.length > 0 && <p className="search-message">Mostrando resultados para '{this.state.query}'...</p>}




                
                {/*show or hide loading gif*/}
                <img src={Loader} alt="loading gif" className={`loading-gif ${loading ? 'show' : 'hide' } `}/>

                {/*Navigation*/}
                <PageNavigation
                    loading={loading}
                    showPrevLink={showPrevLink}
                    showNextLink={showNextLink}
                    handlePrevClick={() => this.handlePageClick('prev'/*, event*/)}
                    handleNextClick={() => this.handlePageClick('next'/*, event*/)}
                />

//Quan s'ha canviat l'estat a show a true, llavors es fa showResults

                {/*print results */}
                {this.state.show && this.showResults()}

//Aqui s'ens mostren les "Popular films" inicialment però si hem buscat alguna película s'ens mostren els resultats del Search

                {/* Popular films or Search Results */}
                {this.renderSearchResults()}

                {/*Navigation*/}

                <PageNavigation
                    loading={loading}
                    showPrevLink={showPrevLink}
                    showNextLink={showNextLink}
                    handlePrevClick={() => this.handlePageClick('prev'/*, event*/)}
                    handleNextClick={() => this.handlePageClick('next'/*, event*/)}
                />

            </div>
            
        )
    }

    resetState(){
        this.setState({
            query: '',
            results:{},
            results2:{},
            loading: false,
            message: '',
            totalResults: 0,
            totalPages: 0,
            currentPageNum: 0,
            show:false,
        });
    }

    startState(){
        this.state={
            query: '',
            results:{},
            results2:{},
            loading: false,
            message: '',
            totalResults: 0,
            totalPages: 0,
            currentPageNum: 0,
            show:false,
        };
    }


//funció que s'utilitza per mostrar la llista  

    getPopularFilms(){
        const popularFilmsUrl = `https://api.themoviedb.org/3/movie/popular?api_key=417f399abcc8fa6b50750d4fc444e2fe`;

        axios.get(popularFilmsUrl).then(resp=>{
                this.setState({
                    results: resp.data.results
                })

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            console.log(this.state);
        })
    }
}

export default Search;