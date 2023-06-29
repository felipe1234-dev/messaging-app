import { DarkBackground, LoaderContainer, LoaderFigure } from "./styles";

interface PageLoaderProps {
    visible?: boolean;
}

function PageLoader(props: PageLoaderProps) {
    const { visible = false } = props;

    return (
        <DarkBackground hidden={!visible}>
            <LoaderContainer>
                <LoaderFigure />
            </LoaderContainer>
        </DarkBackground>
    );
}

export default PageLoader;
export type { PageLoaderProps };
