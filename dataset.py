import xlrd
import pandas as pd

def cell2float(x):
    """Get cell value as float. If there is no data, such as some P/E, returns None."""
    try:
        return float(x.value)
    except ValueError as e:
        print("Can't convert to float: {}".format(x))
    return None # Or 0.0 float(0.0)

def ts_date(x): 
    """Get date from Cell."""
    return xlrd.xldate_as_datetime(x.value, 0)

def ts_floats(df, cols):
    """Make float values for columns named in cols"""
    for c in cols:
        try:
            df[c] = df[c].apply(cell2float)
        except ValueError as e:
            print("Mapping to Floats Error in Column {} \nFrame:{}".format(c, df.head()))
    return df

class HistoricalTrading:
    def __init__(self, symbol, dataFolder=None):
        self.symbol = symbol
        self.workbook = xlrd.open_workbook("%s/HistoricalTrading.xlsx" % symbol)
        self._df = self.dataframe()

    @property
    def worksheet(self):
        return self.workbook.sheet_by_index(0)

    def dataframe(self, clean=True):
        """Returns data frame indexed by daily trading date. Convert to floats / clean if clean flag is set."""
        # Worksheet is the first one in Workbook
        sh = self.worksheet

        # Header label at row 29th
        headers = [hname.value for hname in sh.row(29)]

        # Data row starts from row 30th to 3 lines before end of file
        data_rows = []
        for k in range(30, sh.nrows):
            # Check row-level correctness
            # Each data row should have 29 values
            assert(len(sh.row(k))==29)
            data_rows.append(sh.row(k))

        # Create dataframe
        df = pd.DataFrame(data_rows, columns=headers)

        df = df[:-3] # Remove last three lines

        # Date column is a date. This will be index for time-series data frame
        df['Date'] = df.Date.apply(ts_date)
        df = df.set_index('Date')
        
        # Convert values to floats and clean data frame
        if clean:
            df = ts_floats(df, ['Prior', 'Open', 'High', 'Low', 'Close', 'Average', 'Change', '%Change'])

            df = ts_floats(df, ['P/BV', 'Listed Shares', '%Volume Turnover'])

            df = ts_floats(df, ['Total Volume (k.Shares)', 'P/E', 'Market Cap. (M.Baht)'])

            df = ts_floats(df, ['Bid', 'Offer'])
        
        return df
    
    def timeseries(self):
        ts = {}
        # Daily average price
        ts['daily_averages'] = self._df[['Date','Average']].set_index('Date')

        # Spread daily, Offer - Bid
        daily_spreads = self._df[['Date', 'Bid', 'Offer']].set_index('Date')
        daily_spreads['Spread'] = daily_spreads['Offer'] - daily_spreads['Bid']
        ts['daily_spreads'] = daily_spreads
        
        # Create Daily returns dataframe
        ts['daily_returns'] = self._df[['Date','%Change']].set_index('Date')
        
        # Create Daily P/E dataframe
        ts['daily_pe'] = self._df[['Date','P/E']].set_index('Date')
        
        # Create Daily market cap dataframe
        ts['daily_marketcap'] = self._df[['Date', 'Market Cap. (M.Baht)']].set_index('Date')
        
        return ts
        
    def dump_lines(self):
        sh = self.workbook.sheet_by_index(0)
        print("{0} {1} {2}".format(sh.name, sh.nrows, sh.ncols))
        print("Cell D30 is {0}".format(sh.cell_value(rowx=29, colx=3)))
        for rx in range(sh.nrows):
            print(sh.row(rx))
    
    def plot_all(self):  
        ts = self.timeseries()

        daily_returns = ts['daily_returns']
        daily_averages = ts['daily_averages']
        daily_pe = ts['daily_pe']
        daily_marketcap = ts['daily_marketcap']
        daily_spreads = ts['daily_spreads']

        # Construct daily returns dataframe
        daily_returns.plot()
        daily_averages.plot()
        daily_pe.plot()
        daily_marketcap.plot()
        daily_spreads.plot()

if __name__ == '__main__':
    import os, os.path
    HOME = os.path.join(".", '[SETSmart] SET100 Prices 2015-2019', 'SET100_Data')
    os.chdir(HOME)
    htdat = HistoricalTrading('TASCO')
    htdat.dataframe()
    htdat.plot_all()