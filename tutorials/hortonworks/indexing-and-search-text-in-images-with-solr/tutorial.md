A very common request from many customers is to be able to index text in image files; for example, text in scanned PNG files. In this tutorial we are going to walkthrough how to do this with SOLR.

### [](#prerequisite)Prerequisite

*   [Hortonworks Sandbox](http://hortonworks.com/sandbox)

### [](#step-by-step-guide)Step-by-step guide

*   **Install dependencies – **this will provide you support for processing pngs, jpegs, and tiffs



yum install autoconf automake libtool

yum install libpng-devel

yum install libjpeg-devel

yum install libtiff-devel

yum install zlib-devel



*   **Download Leptonica, an image processing library**



wget [http://www.leptonica.org/source/leptonica-1.69.tar.gz](http://www.leptonica.org/source/leptonica-1.69.tar.gz)



*   **Download Tesseract, an Optical Character Recognition engine**



wget [http://tesseract-ocr.googlecode.com/files/tesseract-ocr-3.02.02.tar.gz](http://tesseract-ocr.googlecode.com/files/tesseract-ocr-3.02.02.tar.gz)



*   **Ensure proper variables and pathing are set **– This is necessary so that when building leptonica, the build can find the dependencies that you installed earlier. If the path is not correct, you will get Unsupported image type errors when running tesseract command line client.

Also, when installing tesseract, you will place language data at TESSDATA_PREFIX dir.



cat ~/.profile export TESSDATA_PREFIX='/usr/local/share/'  export LD_LIBRARY_PATH=$[LD_LIBRARY_PATH:/usr/local/lib:/usr/lib64](http://ld_library_path/usr/local/lib:/usr/lib64)



*   **Build leptonica**



tar xvf leptonica-1.69.tar.gz  cd leptonica-1.69  ./configure

make

sudo make install



*   **Build Tesseract**



tar xvf tesseract-ocr-3.02.02.tar.gz cd tesseract-ocr ./autogen.sh ./configure

make

sudo make install

sudo ldconfig



*   **Download tesseract language(s) and place them in TESSDATA_PREFIX dir, defined above**



wget [http://tesseract-ocr.googlecode.com/files/tesseract-ocr-3.02.eng.tar.gz](http://tesseract-ocr.googlecode.com/files/tesseract-ocr-3.02.eng.tar.gz) tar xzf tesseract-ocr-3.02.eng.tar.gz

cp tesseract-ocr/tessdata/* /usr/local/share/tessdata



*   **Test Tesseract – **Use the image in this blog post. You’ll notice that this is where I started. The ‘hard’ part of this was getting the builds correct for leptonica. And the problem there was ensuring that I had the correct dependencies installed and that they were available on the path defined above. If this doesn’t work, there’s no sense moving on to SOLR.

[http://blog.thedigitalgroup.com/vijaym/2015/07/17/using-solr-and-tikaocr-to-search-text-inside-an-image/](http://blog.thedigitalgroup.com/vijaym/2015/07/17/using-solr-and-tikaocr-to-search-text-inside-an-image/)



/usr/local/bin/tesseract ~/OM_1.jpg ~/OM_out



Tesseract Open Source OCR Engine v3.02.02 with Leptonica



cat ~/OM_out.txt ‘  '"I“ " "'  ./ lrast.  Shortly before the classes started I was visiting a. certain public school, a school set  in a typically English countryside, which on the June clay of my visit was wonder- fully beauliful.  The  Head  Master—-no less typical than his

school and the country-side—pointed out the charms of

both,  and his pride came out  in the ?nal remark which he made

beforehe left me.  He explained that he had a class to take in'I'heocritus.  Then  (with a. buoyant gesture);  “  Can you , conceive anything more delightful than a class  in  Theocritus, on such a day and  in such a place?"



If you have text in your out file, then you’ve done it correctly!

1.  **Start Solr Sample – **This sample contains the Proper Extracting Request Handler for processing with tika

[https://wiki.apache.org/solr/ExtractingRequestHandler](https://wiki.apache.org/solr/ExtractingRequestHandler)



cd  /opt/lucidworks-hdpsearch/solr/bin/  ./solr -e dih



*   **Use SOLR Admin to upload the image**

Go back to the blog post or to the RequestHandler page for the proper update/extract command syntax.

1. From SOLR admin, select the tika core.
2. Click Documents
3. In the Request-Handler (qt) field, enter /update/extract
4. In the Document Type drop down, select File Upload
5. Choose the png file
6. In the Extracting Req. Handler Params box, type the following:

[literal.id](http://literal.id/)=d1&uprefix=attr_&fmap.content=attr_content&commit=true

Understanding all the parameters is another process, but the [literal.id](http://literal.id/) is the unique id for the document. For more information on this command, start by reviewing [https://wiki.apache.org/solr/ExtractingRequestHandler](https://wiki.apache.org/solr/ExtractingRequestHandler) and then the SOLR documentation.

*   **Run a query**
    1.  From SOLR admin, select tika core.
    2.  Click Query.
    3.  In the q field, type attr_content:explained
    4.  Execute the query.

[http://sandbox.hortonworks.com:8983/solr/tika/select?q=attr_content%3Aexplained&wt=json&indent=true](http://sandbox.hortonworks.com:8983/solr/tika/select?q=attr_content%3Aexplained&wt=json&indent=true)

*   **Try it again**

Use another png or supported file type. Be sure to use the same Request Handler Params, except provide a new unique [literal.id](http://literal.id/). Note, that the attr_content is a dynamic field, and it cannot be highlighted.

I am sure this example can be extended to many use cases that we have not imagined. Let us know in the comments, if you are doing interesting things with Solr.  