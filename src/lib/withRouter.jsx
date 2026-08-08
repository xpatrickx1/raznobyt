import { useInRouterContext, MemoryRouter } from 'react-router-dom';

export default function withRouter(WrappedComponent) {
    return function WithRouter(props) {
        const inRouter = useInRouterContext();
        if (!inRouter) {
            return (
                <MemoryRouter>
                    <WrappedComponent {...props} />
                </MemoryRouter>
            );
        }
        return <WrappedComponent {...props} />;
    };
}
