import { Link } from './Link';

export function Footer() {
  return (
    <footer className="nostagik-default-page-layout bg-slate-100 text-sm">
      <section className="py-12 col-start-2 space-y-4">
        <h4 className="text-base font-bold text-slate-600">Nostagik</h4>
        <p>
          by <Link href="https://fillmember.net">fillmember</Link>
        </p>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="https://github.com/fillmember/nostagik" target="_blank">
              GitHub
            </Link>
          </li>
        </ul>
      </section>
    </footer>
  );
}
