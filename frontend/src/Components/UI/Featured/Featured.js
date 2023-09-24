import { useEffect, useState } from "react";
import Card from "../Card/Card";
import { useContext } from "react";
import { ConfigContext } from "./../../../Contexts/Config/index";

export default function Featured() {
  const [featured, setFeatured] = useState(null);

  let { api_urls, api_secrets } = useContext(ConfigContext);

  useEffect(() => {
    fetch(
      `${api_urls.games}/api/games?dates=2021-01-01,2021-12-31&ordering=-rating&key=${api_secrets.games}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setFeatured(data.results.slice(0, 4));
      });
  }, [api_urls.games, api_secrets.games]);

  return (
    <div className="container mt-5">
      <div className="row">
        {featured &&
          featured.map((el) => {
            return (
              <div key={el.id} className="col-12 col-md-6 col-lg-3">
                <Card
                  image={el.background_image}
                  name={el.name}
                  slug={el.slug}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
