/*SPA - Não endicado para site de pesquisa
import React , {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []);
  return (
    <div></div>
  )
}
*/
// SSR atualizado muitas fezes
import React  from "react";
import Link from 'next/link';
import Image from 'next/Image';
import styles from "./home.module.scss";
import ptBR from "date-fns/locale/pt-BR"
import { format, parseISO } from 'date-fns';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];

}

export default function Home({allEpisodes, latestEpisodes} : HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episodes => {
            return (
              <li key={episodes.id}>
                <img
                  width='192'
                  height='192'
                  src={episodes.thumbnail} 
                  alt={episodes.title}
                />
                
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episodes.id}`}>
                    <a >{episodes.title}</a>
                  </Link>
                  <p>{episodes.members}</p>
                  <span>{episodes.publishedAt}</span>
                  <span>{episodes.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episodeo"/>
                </button>
                
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2> Todos episódes</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcastr</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
            
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td>
                    <img 
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    />
                  </td>
                  <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episode"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
/*
export async function getServerSideProps() {
  
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
    
  return {
    props: {
      episodes: data,
    }
  }
}
*/
// SSG atulizados poucas vezes
import {GetStaticProps} from 'next';
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
export  const getStaticProps = async() => {
  
  const {data} = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
 
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  }) 

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60* 60 * 8,
  }
}

