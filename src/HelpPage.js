import React from "react";

function HelpPage() {
    return (
        <div>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-2 px-md-5 text-center text-lg-start my-5">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-600 mb-500 mb-lg-0" style={{ zIndex: "10" }}>
                            <div className="col-lg-600 mb-500 mb-lg-0 position-relative">
                                <p className="mb-2 opacity-70" style={{ color: "hsl(218, 81%, 85%)", position: "relative", bottom: "30px", fontSize: "22px" }}>
                                    <ul> <u style={{ fontSize: "40px" }}> About Types of Citations </u> <br />  <br />
                                        <li><u>Books:</u> Writing a book or book chapter is different from an article because the author has
                                            more opportunity, with more pages allowed, to provide background information and discuss related
                                            content than in a manuscript for a journal. Writing a book requires time and commitment.
                                            An early consideration is whether the author or coauthors will write all of the chapters themselves or
                                            if the book will be a contributed text. In a contributed book, authors or coauthors write individual
                                            chapters under the guidance of an editor who assembles those chapters into a book.
                                        </li> <br />
                                        <li><u> Book Chapter:</u> A book-chapter is defined as a main division of a book, treatise, or the like, usually
                                            bearing a number or title. Every book has chapters in them bearing numbers and names; in case of magazines,
                                            they have titles, no numbers. The chapters in any particular book could be read in order of the chapter
                                            number or as per the reader’s wish.
                                            Know <a style={{ color: "#071a52" }} target="_blank" href="https://selfpublishing.com/how-to-write-a-book-chapter/">how to write book chapter</a>.
                                        </li><br />
                                        <li> <u>Conference Paper:</u> A conference paper is often a combination of a written document and an oral presentation.
                                            You may be asked to transmit a copy of your paper to a commentator before presenting at the conference.
                                            As a result, your paper should follow the conventions of academic papers and oral presentations. It has
                                            fewer pages in comparison to Jornal’s paper.
                                        </li><br />
                                        <li><u>Journal Article:</u> A journal is a regular periodical publication that contains a collection of peer-reviewed
                                            papers and is published on a monthly or bi-monthly basis. A high 'impact rating,' which is a measure of c
                                            itations to papers in the journal, is beneficial. it has more pages compare to the conference paper.
                                        </li><br />
                                        <li><u>Research Paper:</u> What image comes into mind as you hear those words:
                                            working with stacks of articles and books, hunting the "treasure" of others' thoughts?
                                            Whatever image you create, it's a sure bet that you're envisioning sources of
                                            information:articles, books, people, artworks. <br />
                                            A research paper involves surveying a field of knowledge in order to find the best possible information in that field.
                                            Know <a style={{ color: "#071a52" }} target="_blank" href="https://www.grammarly.com/blog/how-to-write-a-research-paper/">how to write research paper</a>. Great information provided by Matt Ellis.
                                        </li><br />
                                    </ul> <br />
                                    <ul> <u style={{ fontSize: "40px" }}>About Form fields</u> <br /> <br />
                                        <li> <u> Title:</u> The “title” should be descriptive, direct, accurate, appropriate, interesting,
                                            concise, precise, unique, and should not be misleading.
                                        </li><br />
                                        <li><u>Abstarct:</u> The “abstract” needs to be simple, specific, clear, unbiased, honest, concise,
                                            precise, stand-alone, complete, structured and should not be misrepresentative. The abstract is a summary or synopsis
                                            of the full research paper and also needs to have similar characteristics like the title.
                                        </li><br />
                                        <li><u> Total Volume(s): </u> Volume typically refers to the number of years the publication has been circulated <br />
                                            In the example below, the volume number is 49. <br />
                                            Godfrey, D. (2005). Adapting historical citations to APA Style. Journal of Broadcasting & Electronic Media, 49(4), 544-547.
                                            That means 49 times it has been circulated in a year.
                                        </li><br />
                                        <li> <u> Edition:</u> It is like 3rd or 4th edition of any citation.
                                        </li><br />
                                        <li> <u> Pages:</u> Total number of pages that citation has.
                                        </li>
                                    </ul>  <br /> <br />
                                    <ul> <u style={{ fontSize: "40px" }}> About Different Roles </u> <br /> <br />
                                        <li><u> Admin:</u> There are more privileges available to admins than faculty. The admin can upload citations on behalf
                                            of students and set the status of previous citations by approving or rejecting them.
                                            The admin can also delete faculty members' accounts if they no longer need their account.
                                            While creating admin account, admin have to create a private key for faculty members, which is the only key faculty can use to create accounts.
                                        </li><br />
                                        <li><u>Faculty:</u> Faculty can upload the citation on behalf of students, they have been given a
                                            private key within the institute. Using that key they can create their account.
                                            It is possible to update citation general information even after it has been added to the site.
                                        </li>
                                    </ul>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HelpPage;