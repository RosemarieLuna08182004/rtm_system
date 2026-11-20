import { useMemo, useState } from "react";
import { UserTables } from "../../../types";
import { countryFlag, countryName } from "../../../shared/data/countries";

export const NOT_SET = '__none__';

export interface CountryCount { Code: string; Name: string; Count: number }

/** App users (not admins) per country, most first; accounts without a country are grouped as "Not set". */
export const countUsersByCountry = (users: UserTables): CountryCount[] => {
    const counts = new Map<string, number>();
    users.forEach(u => {
        const code = u.Country && countryName(u.Country) ? u.Country : NOT_SET;
        counts.set(code, (counts.get(code) ?? 0) + 1);
    });
    return [...counts.entries()]
        .map(([Code, Count]) => ({ Code, Count, Name: Code === NOT_SET ? 'Not set' : countryName(Code) ?? Code }))
        .sort((a, b) => (a.Code === NOT_SET ? 1 : 0) - (b.Code === NOT_SET ? 1 : 0) || b.Count - a.Count || a.Name.localeCompare(b.Name));
};

interface Props {
    Counts: CountryCount[];
    Total: number;
    /** Country code currently filtered on, or '' for all */
    Selected: string;
    OnSelect: (code: string) => void;
}

const SHOWN = 8;

/** Bar list of users per country; clicking a bar filters the table below. */
export const UsersByCountry = ({ Counts, Total, Selected, OnSelect }: Props) => {
    const [showAll, setShowAll] = useState(false);
    const countries = Counts.filter(c => c.Code !== NOT_SET).length;
    const notSet = Counts.find(c => c.Code === NOT_SET)?.Count ?? 0;
    const max = Math.max(1, ...Counts.map(c => c.Count));
    const list = useMemo(() => (showAll ? Counts : Counts.slice(0, SHOWN)), [Counts, showAll]);

    if (!Total) return null;

    return (
        <section aria-labelledby="users-by-country" className="w-full rounded-md bg-white px-4 py-4 mb-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div className="flex flex-col">
                    <h2 id="users-by-country" className="text-lg font-bold text-slate-900">Users by country</h2>
                    <span className="text-sm italic text-slate-500">
                        {countries} {countries === 1 ? 'country' : 'countries'} · {notSet} without a country yet · click a bar to filter
                    </span>
                </div>
                {Selected && (
                    <button type="button" onClick={() => OnSelect('')} className="text-sm font-medium text-primary hover:underline">Show all countries</button>
                )}
            </div>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-1.5 lg:grid-cols-2">
                {list.map(c => {
                    const active = Selected === c.Code;
                    const percent = Math.round((c.Count / Total) * 100);
                    return (
                        <li key={c.Code}>
                            <button
                                type="button"
                                onClick={() => OnSelect(active ? '' : c.Code)}
                                aria-pressed={active}
                                title={`${c.Name}: ${c.Count} of ${Total} users`}
                                className={`group grid w-full grid-cols-[minmax(0,2fr)_minmax(3rem,3fr)_auto] items-center gap-3 rounded-md px-2 py-1 text-left text-sm transition-colors ${active ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                            >
                                <span className={`truncate ${c.Code === NOT_SET ? 'italic text-slate-500' : 'text-slate-800'} ${active ? 'font-semibold text-primary' : ''}`}>
                                    {c.Code === NOT_SET ? '—' : countryFlag(c.Code)} {c.Name}
                                </span>
                                <span className="block h-2.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                                    <span className={`block h-full rounded-full ${c.Code === NOT_SET ? 'bg-slate-300' : active ? 'bg-primary' : 'bg-blue-400 group-hover:bg-[#1B42CE]'}`} style={{ width: `${(c.Count / max) * 100}%` }} />
                                </span>
                                <span className="w-20 text-right tabular-nums text-slate-700">{c.Count} <span className="text-slate-400">({percent}%)</span></span>
                            </button>
                        </li>
                    );
                })}
            </ul>
            {Counts.length > SHOWN && (
                <button type="button" onClick={() => setShowAll(v => !v)} className="mt-2 text-sm font-medium text-primary hover:underline">
                    {showAll ? 'Show fewer' : `Show all ${Counts.length}`}
                </button>
            )}
        </section>
    );
};
