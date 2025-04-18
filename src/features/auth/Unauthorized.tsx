import { Card, SubHeader } from '../../components'

const Unauthorized = () => {
    return (
        <Card className="text-center py-10">
            <SubHeader className="text-red-600 text-xl font-semibold mb-4">
                403 - Forbidden
            </SubHeader>
            <p className="text-gray-700">
                Sorry, you do not have permission to access this page.
                <br />
                Please contact your administrator if you believe this is an error.
            </p>
        </Card>
    )
}

export default Unauthorized
