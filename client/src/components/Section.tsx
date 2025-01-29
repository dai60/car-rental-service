type SectionProps = {
    title: string;
    element: JSX.Element;
}

const Section = ({ title, element }: SectionProps) => {
    return (
        <section className="my-4">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            {element}
        </section>
    );
}

export default Section;
