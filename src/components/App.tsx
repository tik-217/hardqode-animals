import { useEffect, useState } from "react";
import {
  requestAnimals,
  Animal,
  Query,
  requestAnimalsWithError,
} from "../lib/api";
import "./../styles.css";
import { useFormik } from "formik";

// // Примеры вызова функций, в консоли можно увидеть возвращаемые результаты
// requestAnimals({ animal: "", amount: "", limit: 4, offset: 0 }).then(
//   console.log
// );
// requestAnimalsWithError({ animal: "", amount: "", limit: 4, offset: 0 }).catch(
//   console.error
// );

export default function App() {
  const [allAnimals, setAllAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>();

  const formik = useFormik({
    initialValues: {
      animal: "",
      amount: "",
      limit: 4,
      offset: 0,
    },
    onSubmit: () => {},
  });

  function fetchApi(payload?: Query) {
    setLoading(true);
    const allAnimals = requestAnimals(payload);

    allAnimals
      .then((animals) => setAllAnimals(animals))
      .catch(() =>
        requestAnimalsWithError({
          animal: "",
          amount: "",
          limit: 4,
          offset: 0,
        }).catch(console.log)
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchApi();
  }, []);

  useEffect(() => {
    fetchApi({ ...formik.values });
  }, [formik.values]);

  return (
    <div className={"app"}>
      <form onSubmit={formik.handleSubmit}>
        <div className={"app__filter"}>
          <input
            type="text"
            placeholder="animal"
            name="animal"
            onChange={formik.handleChange}
            value={formik.values.animal}
          />
          <input
            type="text"
            placeholder="amount"
            name="amount"
            onChange={formik.handleChange}
            value={formik.values.amount}
          />
        </div>
        <div className={"pagination"}>
          <div className={"pagination__pageNum"}>
            <label htmlFor="limit">By page</label>
            <input
              type="number"
              id="limit"
              name="limit"
              onChange={formik.handleChange}
              value={formik.values.limit}
            />
          </div>
          <div className={"pagination__slider"}>
            offset
            <input
              type="number"
              name="offset"
              onChange={formik.handleChange}
              value={formik.values.offset}
            />
          </div>
        </div>
      </form>
      <div className={"app__animals"}>
        <ul className="animalsList">
          {loading && <>Loading...</>}
          {!loading && allAnimals.length === 0 ? (
            <>Animals not found</>
          ) : (
            !loading &&
            allAnimals.map((animal) => (
              <li className={"animalsList__item"} key={animal.id}>
                {animal.animal}, {animal.amount}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
