export default function Title({ title }) {
    const titleClass =
        "text-[20px] xl:text-[40px] text-red-500 xl:text-red-800 text-center bg-red-200 h-[120px] flex justify-center items-center";

    return <h1 className={titleClass}>{title}</h1>;
}
