export const idlFactory = ({ IDL }: any) => {
  const ICSNews = IDL.Record({
    title: IDL.Text,
    content: IDL.Text,
    created_at: IDL.Nat,
  });
  return IDL.Service({
    get_news: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Vec(ICSNews)], ["composite_query"]),
  });
};
