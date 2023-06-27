import { createContext, useState } from "react";
import { TSession } from "../Types";

const useProvideSession = () => {
  const [session, setSession] = useState<TSession[]>([
    {
      "outputId": "4wojBfaVJHhHQQiCn7Br3",
      "timestamp": 1687866437193,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col1",
          "N": "2",
          "Mean": "1.500000",
          "Median": "1.500000",
          "S.Var": "0.500000",
          "P.Var": "0.250000",
          "S.Stdev": "0.707107",
          "P.Stdev": "0.500000",
          "Std.Err": "0.500000",
          "Range": "1"
        },
        {
          "": "col2",
          "N": "1",
          "Mean": "3.000000",
          "Median": "3.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        },
        {
          "": "col3",
          "N": "1",
          "Mean": "3.000000",
          "Median": "3.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        },
        {
          "": "col4",
          "N": "1",
          "Mean": "3.000000",
          "Median": "3.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        },
        {
          "": "col5",
          "N": "1",
          "Mean": "3.000000",
          "Median": "3.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    },
    {
      "outputId": "5JNDwSQgQ4YA4RRf9DOg2",
      "timestamp": 1687866943181,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col1",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        },
        {
          "": "col2",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        },
        {
          "": "col3",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        },
        {
          "": "col4",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    },
    {
      "outputId": "OZ00_NXtMb-LS3OInu9KG",
      "timestamp": 1687866947617,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col1",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    },
    {
      "outputId": "0I3ze-PGg6QM5mxJjq20o",
      "timestamp": 1687866951891,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col2",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    },
    {
      "outputId": "PFdTWsl6yj0vfxBXCypu2",
      "timestamp": 1687866955888,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col3",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    },
    {
      "outputId": "e0gdo3znb2Y5pQ6d1Amdd",
      "timestamp": 1687866959692,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col4",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    },
    {
      "outputId": "sRLjqCA5v_hbSi8ZuEEK5",
      "timestamp": 1687866963809,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col5",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    },
    {
      "outputId": "jwWqFsNRycUsdqaIqQkr1",
      "timestamp": 1687866967904,
      "title": "Descriptive Statistics",
      "type": "descriptive",
      "data": [
        {
          "": "col6",
          "N": "1",
          "Mean": "2.000000",
          "Median": "2.000000",
          "S.Var": "NaN",
          "P.Var": "0.000000",
          "S.Stdev": "NaN",
          "P.Stdev": "0.000000",
          "Std.Err": "NaN",
          "Range": "0"
        }
      ],
      "stats": [
        "",
        "N",
        "Mean",
        "Median",
        "S.Var",
        "S.Stdev",
        "Range",
        "Std.Err",
        "P.Var",
        "P.Stdev"
      ]
    }
  ]);

  const addSessionItem = (item: TSession) => {
    setSession((prev) => prev.concat(item));
  };
  return { session, setSession, addSessionItem };
};

export const SessionContext = createContext<
  ReturnType<typeof useProvideSession>
>({} as ReturnType<typeof useProvideSession>);

type Props = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: Props) => {
  const sessionData = useProvideSession();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};
