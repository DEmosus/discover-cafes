import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import useSWR from "swr";
import styles from "../../styles/Coffee-store.module.css";
import { fetchCoffeeStores } from "@/lib/coffee-store";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/store/store-context";
import { isEmpty } from "@/utils";

export async function getStaticProps(staticProps) {
    const params = staticProps.params;
    const coffeeStores = await fetchCoffeeStores();

    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id;
    })
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
        }
    }
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            }
        };
    })
    return {
      paths,
      fallback: true,
    }
}

const CoffeeStore = (initialProps) => {
    const router = useRouter();

    const id = router.query.id;
    // const { id } = router.query;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});
    const [votingCount, setVotingCount] = useState(0);

    const {
        state: { coffeeStores }
    } = useContext(StoreContext);

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {id, name, address, locality, imgUrl, voting} = coffeeStore || {};
            const response = await fetch("/api/createCoffeeStore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id, name, address: address || "", locality: locality || "", imgUrl, voting: 0
                }),
            });

            await response.json();
        } catch (err) {
            console.log("Error creating coffee store", err);
        }
    };

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
                    return coffeeStore.id.toString() === id;
                });
                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext);
                    handleCreateCoffeeStore(coffeeStoreFromContext);
                }
            }
        } else {
            handleCreateCoffeeStore(initialProps.coffeeStore);
        }
    }, [id, initialProps, initialProps.CoffeeStore, coffeeStores]);

    useEffect(() => {
        if (data && data.length > 0) {
            setCoffeeStore(data[0]);
            setVotingCount(data[0].voting);
        }
    }, [data]);

    const handleUpvoteButton = async() => {
        try {
            const response = await fetch("/api/upVoteCoffeeStoreById", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id, 
                }),
            });

            const dbCoffeeStore = await response.json();

            if (dbCoffeeStore && dbCoffeeStore.length > 0) {
                let count = votingCount + 1;
                setVotingCount(count);
            }
        } catch (err) {
            console.log("Error upvoting the coffee store", err);
        }
    }

    if(router.isFallback) {
        return<div>Loading...</div>
    }

    if (error) {
        return <div>Something went wrong retrieving coffee store page</div>
    }

    const { name = "", address = "", locality = "", imgUrl = "" } = coffeeStore || {};

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                        &larr; Back home
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image className={styles.storeImg} alt={name} src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} width={600} height={360} ></Image>
                </div>
                <div className={cls("glass", styles.col2)}>
                    {address && (
                        <div className={styles.iconWrapper}>
                            <Image alt="icon" src="/static/icons/place.svg" width="24" height="24" />
                            <p className={styles.text}>{address}</p>
                        </div>
                    )}
                    {locality && (
                        <div className={styles.iconWrapper}>
                            <Image alt="icon" src="/static/icons/nearMe.svg" width="24" height="24" />
                            <p className={styles.text}>{locality}</p>
                        </div>
                    )}
                    <div className={styles.iconWrapper}>
                        <Image alt="icon" src="/static/icons/star.svg" width="24" height="24" />
                        <p className={styles.text}>{votingCount}</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up vote!</button>
                </div>
            </div>
            </div>
    )
}

export default CoffeeStore;