export const Logo = (props: { width: number, height: number }) => {
    return (
        <svg width={props.width} height={props.height} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="256" cy="256" r="246" fill="white" />
            <circle cx="255.5" cy="255.5" r="216.5" fill="black" />
            <circle cx="255.5" cy="255.5" r="144.5" fill="white" />
            <circle cx="255.5" cy="255.5" r="82.5" fill="black" />
        </svg>
    );
}