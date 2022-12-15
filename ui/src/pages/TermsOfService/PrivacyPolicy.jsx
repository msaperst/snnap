import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

function PrivacyPolicy(props) {
  const { showGDPR } = props;
  return (
    <>
      <Row className="mb-3">
        <Col>
          <h1 className="h2">Privacy Policy</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            This privacy policy has been compiled to better serve those who are
            concerned with how their &apos;Personally Identifiable
            Information&apos; (PII) is being used online. PII, as described in
            US privacy law and information security, is information that can be
            used on its own or with other information to identify, contact, or
            locate a single person, or to identify an individual in context.
            Please read our privacy policy carefully to get a clear
            understanding of how we collect, use, protect or otherwise handle
            your Personally Identifiable Information in accordance with our
            website.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">
            What personal information do we collect from the people that visit
            our blog, website or app?
          </h2>
          <p>
            When ordering or registering on our site, as appropriate, you may be
            asked to enter your name, email address or other details to help you
            with your experience.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">When do we collect information?</h2>
          <p>
            We collect information from you when you register on our site, fill
            out a form or enter information on our site, or provide us with
            feedback on our products or services
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">How do we use your information?</h2>
          <p>
            We may use the information we collect from you when you register,
            make a purchase, sign up for our newsletter, respond to a survey or
            marketing communication, surf the website, or use certain other site
            features in the following ways:
          </p>
          <ul>
            <li>
              To allow us to better service you in responding to your customer
              service requests
            </li>
            <li>To quickly process your transactions</li>
            <li>
              To follow up with them after correspondence (live chat, email or
              phone inquiries)
            </li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">How do we protect your information?</h2>
          <ul>
            <li>We use vulnerability scanning and scanning to PCI standards</li>
            <li>
              We only provide articles and information. We never ask for credit
              card numbers
            </li>
            <li>We use regular Malware Scanning</li>
          </ul>
          <p>
            Your personal information is contained behind secured networks and
            is only accessible by a limited number of persons who have special
            access rights to such systems, and are required to keep the
            information confidential. In addition, all sensitive/credit
            information you supply is encrypted via Secure Socket Layer (SSL)
            technology.
          </p>
          <p>
            We implement a variety of security measures when a user places an
            order enters, submits, or accesses their information to maintain the
            safety of your personal information.
          </p>
          <p>
            All transactions are processed through a gateway provider and are
            not stored or processed on our servers.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">Do we use &apos;cookies&apos;?</h2>
          <p>
            Yes. Cookies are small files that a site or its service provider
            transfers to your computer&apos;s hard drive through your Web
            browser (if you allow) that enables the site&apos;s or service
            provider&apos;s systems to recognize your browser and capture and
            remember certain information. For instance, we use cookies to help
            us remember and process the items in your shopping cart. They are
            also used to help us understand your preferences based on previous
            or current site activity, which enables us to provide you with
            improved services. We also use cookies to help us compile aggregate
            data about site traffic and site interaction so that we can offer
            better site experiences and tools in the future.
          </p>
          <p>We use cookies to:</p>
          <ul>
            <li>
              Understand and save user&apos;s preferences for future visits.
            </li>
          </ul>
          <p>
            You can review or edit your current cookie options{' '}
            <Button
              variant="link"
              onClick={() => showGDPR(true)}
              style={{ padding: 0, top: '-2px', position: 'relative' }}
            >
              here
            </Button>
          </p>
          <p>
            You can choose to have your computer warn you each time a cookie is
            being sent, or you can choose to turn off all cookies. You do this
            through your browser settings. Since browser is a little different,
            look at your browser&apos;s Help Menu to learn the correct way to
            modify your cookies.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">If users disable cookies in their browser:</h2>
          <p>
            If you turn cookies off, some features will be disabled. Some of the
            features that make your site experience more efficient and may not
            function properly.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">Third-party disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your
            Personally Identifiable Information.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">Third-party links</h2>
          <p>
            Occasionally, at our discretion, we may include or offer third-party
            products or services on our website. These third-party sites have
            separate and independent privacy policies. We therefore have no
            responsibility or liability for the content and activities of these
            linked sites. Nonetheless, we seek to protect the integrity of our
            site and welcome any feedback about these sites.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">Google</h2>
          <p>
            Google&apos;s advertising requirements can be summed up by
            Google&apos;s Advertising Principles. They are put in place to
            provide a positive experience for users.{' '}
            <a
              target="_blank"
              href="https://support.google.com/adwordspolicy/answer/1316548?hl=en"
              rel="noreferrer"
            >
              https://support.google.com/adwordspolicy/answer/1316548?hl=en
            </a>
            .
          </p>
          <p>
            We have not enabled Google AdSense on our site but we may do so in
            the future.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">California Online Privacy Protection Act</h2>
          <p>
            CalOPPA is the first state law in the nation to require commercial
            websites and online services to post a privacy policy. The
            law&apos;s reach stretches well beyond California to require any
            person or company in the United States (and conceivably the world)
            that operates websites collecting Personally Identifiable
            Information from California consumers to post a conspicuous privacy
            policy on its website stating exactly the information being
            collected and those individuals or companies with whom it is being
            shared. - See more at:{' '}
            <a
              target="_blank"
              href="https://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf"
              rel="noreferrer"
            >
              https://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf
            </a>
            .
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">
            According to CalOPPA, we agree to the following:
          </h2>
          <ul>
            <li>Users can visit our site anonymously</li>
            <li>
              Once this privacy policy is created, we will add a link to it on
              our home page or as a minimum, on the first significant page after
              entering our website
            </li>
            <li>
              Our Privacy Policy link includes the word &apos;Privacy&apos; and
              can easily be found on the page specified above
            </li>
          </ul>
          <p>You will be notified of any Privacy Policy changes:</p>
          <ul>
            <li>On our Privacy Policy Page</li>
          </ul>
          <p>Can change your personal information:</p>
          <ul>
            <li>By emailing us</li>
            <li>By logging in to your account</li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">How does our site handle Do Not Track signals?</h2>
          <p>
            We honor Do Not Track signals and Do Not Track, plant cookies, or
            use advertising when a Do Not Track (DNT) browser mechanism is in
            place.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">
            Does our site allow third-party behavioral tracking?
          </h2>
          <p>
            It&apos;s also important to note that we do not allow third-party
            behavioral tracking
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">COPPA (Children Online Privacy Protection Act)</h2>
          <p>
            When it comes to the collection of personal information from
            children under the age of 13 years old, the Children&apos;s Online
            Privacy Protection Act (COPPA) puts parents in control. The Federal
            Trade Commission, United States&apos; consumer protection agency,
            enforces the COPPA Rule, which spells out what operators of websites
            and online services must do to protect children&apos;s privacy and
            safety online.
          </p>
          <p>
            We do not specifically market to children under the age of 13 years
            old.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">Fair Information Practices</h2>
          <p>
            The Fair Information Practices Principles form the backbone of
            privacy law in the United States and the concepts they include have
            played a significant role in the development of data protection laws
            around the globe. Understanding the Fair Information Practice
            Principles and how they should be implemented is critical to comply
            with the various privacy laws that protect personal information.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">
            In order to be in line with Fair Information Practices we will take
            the following responsive action, should a data breach occur:
          </h2>
          <p>We will notify you via email:</p>
          <ul>
            <li>Within 7 business days</li>
          </ul>
          <p>
            We also agree to the Individual Redress Principle which requires
            that individuals have the right to legally pursue enforceable rights
            against data collectors and processors who fail to adhere to the
            law. This principle requires not only that individuals have
            enforceable rights against data users, but also that individuals
            have recourse to courts or government agencies to investigate and/or
            prosecute non-compliance by data processors.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">CAN SPAM Act</h2>
          <p>
            The CAN-SPAM Act is a law that sets the rules for commercial email,
            establishes requirements for commercial messages, gives recipients
            the right to have emails stopped from being sent to them, and spells
            out tough penalties for violations.
          </p>
          <p>We collect your email address in order to:</p>
          <ul>
            <li>
              Send information, respond to inquiries, and/or other requests or
              questions
            </li>
            <li>
              Process orders and to send information and updates pertaining to
              orders
            </li>
            <li>
              Send you additional information related to your product and/or
              service
            </li>
            <li>
              Market to our mailing list or continue to send emails to our
              clients after the original transaction has occurred.
            </li>
          </ul>
          <p>To be in accordance with CANSPAM, we agree to the following:</p>
          <ul>
            <li>Not use false or misleading subjects or email addresses</li>
            <li>
              Identify the message as an advertisement in some reasonable way
            </li>
            <li>
              Include the physical address of our business or site headquarters
            </li>
            <li>
              Monitor third-party email marketing services for compliance, if
              one is used
            </li>
            <li>Honor opt-out/unsubscribe requests quickly</li>
            <li>
              Allow users to unsubscribe by using the link at the bottom of each
              email
            </li>
          </ul>
          <p>
            If at any time you would like to unsubscribe from receiving future
            emails, you can email us at{' '}
            <a target="_blank" href="mailto:contact@snnap.app" rel="noreferrer">
              contact@snnap.app
            </a>{' '}
            and we will promptly remove you from ALL correspondence.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="h4">Contacting Us</h2>
          <p>
            If there are any questions regarding this privacy policy, you may
            contact us using the information below.
          </p>
          <p>
            Snnap
            <br />
            5012 Whisper Willow Dr
            <br />
            Fairfax, Virginia 22030
            <br />
            United States
            <br />
            <a target="_blank" href="mailto:contact@snnap.app" rel="noreferrer">
              contact@snnap.app
            </a>
          </p>
        </Col>
      </Row>
    </>
  );
}

export default PrivacyPolicy;
