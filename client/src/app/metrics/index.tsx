import { GoogleAnalytics } from '@next/third-parties/google'
import  MicrosoftClarity from './MicrosoftClarity'
import LinkedInInsight from './LinkedinInsight'
import MetaPixel from './MetaPixel'
import Trustpilot from './Trustpilot'

const Metrics = () => (
    <>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "G-7VWD8QMZ5X"} />
        <MicrosoftClarity />
        <LinkedInInsight />
        <MetaPixel />
        <Trustpilot showWidget={false} showIntent />
    </>
)

export default Metrics