import { Wrapper, InnerWrapper, Dot } from "./styles";

interface PageLoaderProps {
    visible?: boolean
}

function PageLoader(props: PageLoaderProps) {
    const { visible = false } = props;

    return (
        <Wrapper hidden={!visible}>
            <InnerWrapper>
                <Dot />
                <Dot />
                <Dot />
                <Dot />
            </InnerWrapper>
        </Wrapper>
    );
}

export default PageLoader;
export type { PageLoaderProps };