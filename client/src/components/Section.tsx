type SectionProps = {
    title: string;
    element: JSX.Element;
}

const Section = ({ title, element }: SectionProps) => {
    return (
        <section className="my-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-start">{title}</h1>
            {element}
        </section>
    );
}

export default Section;
