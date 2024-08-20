import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Card from "@/components/card";
import { fetchCoffeeStores } from "@/lib/coffee-store";
import useTrackLocation from "@/hooks/use-track-location";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "@/store/store-context"

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
 
  return { 
    props: { 
      caffees: coffeeStores
    }, 
  };
}

export default function Home(props) {

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  useEffect(() => {
    const fetchData = async () => {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: coffeeStores,
            }
          })
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    };
  
    fetchData();
  }, [dispatch, latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Masters</title>
        <meta name="description" content="discover coffee shops near you" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Master of coffee</h1><br/>
        <Banner buttonText={isFindingLocation ? "Loading..." : "View caffes nearby"} handleOnClick={handleOnBannerBtnClick}/>
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image alt="image" src="/static/barista.svg" width={700} height={400}/>
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Cafés near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((caffee) => {
                return (
                  <Card key={caffee.id} className={styles.card} name={caffee.name} imgUrl={caffee.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} href={`/coffee-store/${caffee.id}`}/>
                )
              })}
            </div>
          </div>
        )}
        
        {props.caffees.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Nairobi Cafés</h2>
            <div className={styles.cardLayout}>
              {props.caffees.map((caffee) => {
                return (
                  <Card key={caffee.id} className={styles.card} name={caffee.name} imgUrl={caffee.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} href={`/coffee-store/${caffee.id}`}/>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
